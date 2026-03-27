
import os, json, subprocess
base = r"E:\Claude\Synthex-Website"
os.makedirs(os.path.join(base, "lib"), exist_ok=True)
print("lib dir ready")
# Write blog.json
blog_data = [{"id": "how-to-prompt-cinematic-portraits", "title": "How to Prompt Cinematic Portraits in Midjourney v6", "excerpt": "A step-by-step guide.", "body": "# Test", "tags": ["tutorial"], "date": "2025-12-01", "thumbnailUrl": "https://picsum.photos/seed/blog-portrait/800/450"}]
with open(os.path.join(base, "blog.json"), "w") as f:
    json.dump(blog_data, f, indent=2)
print("blog.json written")
