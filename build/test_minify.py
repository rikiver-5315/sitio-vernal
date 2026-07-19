import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from minify import minify_css, minify_js


def test_minify_css_strips_comments_and_whitespace():
    src = """
    /* comentario */
    .a {   color:   red;   }

    .b { color: blue; }
    """
    out = minify_css(src)
    assert '/*' not in out
    assert len(out) < len(src)
    assert '.a{color: red;}'.replace(' ', '') in out.replace(' ', '')


def test_minify_js_strips_comments_and_blank_lines():
    src = "\n\n// comentario\nfunction f() {\n  return 1;\n}\n\n"
    out = minify_js(src)
    assert '// comentario' not in out
    assert 'function f()' in out
    assert out.count('\n\n') == 0


test_minify_css_strips_comments_and_whitespace()
test_minify_js_strips_comments_and_blank_lines()
print('minify.py: todos los tests pasaron')
