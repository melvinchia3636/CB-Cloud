from django import template

register = template.Library()

@register.simple_tag
def fetchshort(bytes):
    if bytes < 1024: return str(bytes) + " bytes"
    size = ["bytes", "KB", "MB", "GB", "TB"]
    for i, e in enumerate(size):
        b = bytes // (1024**i)
        if b <= 1024:
            return "{} {}".format(round(bytes / 1024**i, 1), e)