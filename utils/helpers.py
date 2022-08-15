import os
from pathlib import Path
from rest_framework.response import Response
from django.core.files.images import get_image_dimensions
from utils.validators import is_image
from PIL import Image, ImageOps
from pathlib import Path

def delete_media(path_):
    """ delete media file if it exists
    """
    f = Path(path_)
    if f.exists():
        f.unlink()


def non_field_response(msg = ""):
    return Response({ 'non_field_errors': [msg] },status=400)


def set_image_dimensions(model,field_name):
    """
        field  must be a  FileField
        The model must have width and height fields 
    """
    file = getattr(model,field_name)
    if is_image(file.name):
        width, height = get_image_dimensions(file)
        model.width = width         
        model.height = height         
        model.save()

MAX_SIZE = (900, 700)
def convert2webp(image_, dest=None):
    """ convert the image instance into webp
        format.
    """
    orig_image = Image.open(image_).convert("RGB")
    img = ImageOps.exif_transpose(orig_image)
    img.thumbnail(MAX_SIZE, Image.ANTIALIAS)

    fpath, ext_ = os.path.splitext(image_)
    img.save(f"{fpath}.webp", 'webp', quality=95)

    return


def field_image_to_webp(instance,field_name=None):
    if not field_name: return
    image = getattr(instance,field_name)
    if not image: return

    path, extension = os.path.splitext(image.name)
    if extension != '.webp':
        # current file path. will be use to delete
        # this file after the new one is generated
        current = image.path
        # convert the image to webp
        convert2webp(current)
        image.name = f"{path}.webp"
        instance.save()
        # delete the old file
        delete_media(current)


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip