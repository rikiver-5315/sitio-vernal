import re
import shutil
import os

EXCLUDE_DIRS = {'.git', 'docs', 'build', 'dist'}


def minify_css(text):
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s*([{}:;,])\s*', r'\1', text)
    return text.strip()


def minify_js(text):
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    lines = text.split('\n')
    kept = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith('//'):
            continue
        kept.append(stripped)
    return '\n'.join(kept)


def build_dist(source_dir, dist_dir):
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)

    def ignore(dir_path, names):
        rel = os.path.relpath(dir_path, source_dir)
        if rel == '.':
            return [n for n in names if n in EXCLUDE_DIRS]
        return []

    shutil.copytree(source_dir, dist_dir, ignore=ignore)

    for root, dirs, files in os.walk(dist_dir):
        for name in files:
            path = os.path.join(root, name)
            if name.endswith('.css'):
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(minify_css(content))
            elif name.endswith('.js'):
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(minify_js(content))


if __name__ == '__main__':
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dist_path = os.path.join(project_root, 'dist')
    build_dist(project_root, dist_path)
    print('dist/ generado en:', dist_path)
