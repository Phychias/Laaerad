import os
import time
import json  # 引入 json 库
import re
from pathlib import Path
import frontmatter
from openai import OpenAI

# ================= 配置区域 =================
# 建议使用 DeepSeek, Moonshot (Kimi) 或 ChatGPT
API_KEY = "sk-98ff040d4bb04453a8a1a6325af24ccc"
BASE_URL = "https://api.deepseek.com" # 或者是c

SOURCE_DIR = Path("docs/zh")
TARGET_DIR = Path("docs/en")
GLOSSARY_FILE = Path("glossary.json")

client = OpenAI(api_key=API_KEY, base_url=BASE_URL)

# 基础系统指令
BASE_SYSTEM_PROMPT = """
You are a professional technical documentation translator. 
Your task is to translate Chinese technical documentation into English.

Rules:
1. Maintain the original Markdown format strictly.
2. DO NOT translate code blocks, inline code (`code`), or variable names.
3. Keep the placeholder strings like __LINK_X__ exactly as they are.
4. If the content is already in English, return it as is.
"""

# ===========================================

class LinkManager:
    """处理链接保护的类"""
    def __init__(self):
        self.links = []
        # 匹配 markdown 链接: [text](url) 或 ![alt](url)
        # 捕获组 1: ! 或 空 (判断是不是图片)
        # 捕获组 2: 链接文本/Alt文本 (比如 [首页])
        # 捕获组 3: URL (比如 /guide/index.md)
        self.pattern = re.compile(r'(!?\[)(.*?)(\]\()(.*?)(\))')

    def replace_callback(self, match):
        """正则替换的回调函数"""
        prefix = match.group(1) # [ or ![
        text = match.group(2)   # Link text
        mid = match.group(3)    # ](
        url = match.group(4)    # The actual URL
        suffix = match.group(5) # )
        
        # 保存原始 URL
        placeholder = f"__LINK_{len(self.links)}__"
        self.links.append(url)
        
        # 返回替换后的字符串，只把 URL 换成占位符
        return f"{prefix}{text}{mid}{placeholder}{suffix}"

    def mask(self, content):
        """将内容里的 URL 替换为占位符"""
        self.links = [] # 重置
        return self.pattern.sub(self.replace_callback, content)

    def unmask(self, translated_content):
        """将翻译后内容里的占位符还原为 URL"""
        for i, url in enumerate(self.links):
            # 简单字符串替换，把 __LINK_0__ 换回 ../foo/bar.md
            placeholder = f"__LINK_{i}__"
            translated_content = translated_content.replace(placeholder, url)
        return translated_content

# ===========================================

def load_glossary():
    if not GLOSSARY_FILE.exists(): return {}
    try:
        with open(GLOSSARY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except: return {}

GLOSSARY = load_glossary()

def build_dynamic_prompt(text_content):
    relevant_terms = []
    for zh_term, en_term in GLOSSARY.items():
        if zh_term in text_content:
            relevant_terms.append(f"- {zh_term} -> {en_term}")
    
    if not relevant_terms:
        return BASE_SYSTEM_PROMPT

    glossary_section = "\n".join(relevant_terms)
    # print(f"    (Detected {len(relevant_terms)} custom terms)")
    
    return f"""{BASE_SYSTEM_PROMPT}

CRITICAL TERMINOLOGY rules:
{glossary_section}
"""

def translate_content(content):
    if not content or not content.strip():
        return ""

    # 1. 保护链接
    link_manager = LinkManager()
    masked_content = link_manager.mask(content)

    # 2. 生成 Prompt (用 masked_content 生成，避免把占位符当术语)
    system_prompt = build_dynamic_prompt(content) # 用原始内容查术语，防止术语刚好在链接里
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat", 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": masked_content} # 发送带占位符的内容
            ],
            temperature=0.1, 
        )
        translated_masked = response.choices[0].message.content
        
        # 3. 还原链接
        final_content = link_manager.unmask(translated_masked)
        
        return final_content
        
    except Exception as e:
        print(f"Error during translation: {e}")
        return None

def process_file(source_path, target_path):
    with open(source_path, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)

    # 翻译 Title (通常 Title 里不放链接，所以可以直接翻)
    if 'title' in post.metadata:
        print(f"  - Translating title: {post.metadata['title']}")
        post.metadata['title'] = translate_content(post.metadata['title'])
    if 'description' in post.metadata:
        post.metadata['description'] = translate_content(post.metadata['description'])
    
    print(f"  - Translating body content...")
    translated_body = translate_content(post.content)
    
    if translated_body:
        post.content = translated_body
        target_path.parent.mkdir(parents=True, exist_ok=True)
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(frontmatter.dumps(post))
        print(f"✅ Created/Updated: {target_path}")
    else:
        print(f"❌ Failed to translate body: {source_path}")

def main():
    if not SOURCE_DIR.exists():
        print(f"Error: Source directory {SOURCE_DIR} does not exist.")
        return

    print("🚀 Starting Translation (Link Protection Enabled)...")
    
    for root, dirs, files in os.walk(SOURCE_DIR):
        for file in files:
            if not file.endswith(".md"):
                continue
            
            source_file = Path(root) / file
            rel_path = source_file.relative_to(SOURCE_DIR)
            target_file = TARGET_DIR / rel_path
            
            if target_file.exists():
                src_mtime = source_file.stat().st_mtime
                tgt_mtime = target_file.stat().st_mtime
                if src_mtime < tgt_mtime:
                    continue
            
            print(f"🔄 Processing: {rel_path}")
            process_file(source_file, target_file)
            time.sleep(1) 

    print("✨ Sync complete!")

if __name__ == "__main__":
    main()