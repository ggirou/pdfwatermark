from io import BytesIO
from re import match

from PyPDF2 import PdfFileWriter, PdfFileReader
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import Color
from webcolors import hex_to_rgb
import click


@click.command()
@click.argument('src', type=click.Path(exists=True))
@click.argument('dst', type=click.Path())
@click.option('-w', '--watermark', default='TEST',
              help='Annotation text, use {} to include parts of file name if '
                   'you are using --regex')
@click.option('-f', '--font-name', default='Helvetica-Bold',
              help='Font name')
@click.option('-s', '--font-size', default=60, type=int,
              help='Font size')
@click.option('-c', '--color', default='#000000',
              help='Font colour')
@click.option('-o', '--opacity', default=1.0,
              help='Opacity from 0 transparent to 1 solid')
@click.option('-x', default=500,
              help='X coordinate')
@click.option('-y', default=200,
              help='Y coordinate')
@click.option('-a', '--angle', default=30,
              help='Angle')
def annotate(src, dst, watermark, font_name, font_size, color, opacity,
             x, y, angle):
  mask_stream = BytesIO()

  watermark_canvas = canvas.Canvas(mask_stream, pagesize=A4)
  watermark_canvas.setFont(font_name, font_size)
  r, g, b = hex_to_rgb(color)
  c = Color(r, g, b, alpha=opacity)
  watermark_canvas.setFillColor(c)

  watermark_canvas.rotate(angle)
  for i in range(-2, 2):
    for j in range(-10, 10):
      watermark_canvas.drawString(i * x + j * y, j * y, watermark)
  watermark_canvas.save()

  mask_stream.seek(0)

  mask = PdfFileReader(mask_stream)
  input = PdfFileReader(src)
  output = PdfFileWriter()

  for page in range(0, input.getNumPages()):
    page = input.getPage(page)
    page.mergePage(mask.getPage(0))
    output.addPage(page)

  with open(dst, "wb") as output_stream:
    output.write(output_stream)


if __name__ == '__main__':
  annotate()
