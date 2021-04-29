# Why?
I needed to "stamp" quite a bunch of PDF files with a large transparent text mark.
The mark content depended on the PDF file name. 
I looked around and realised that I can't seem to be able to find anything that
would help me get it done in Linux without major pain of some sort. So I decided 
to roll my own

# What it does. 
`pdfwatermark` allows you to add an arbitrary text line on the first page of
a given PDF file. You can also make the text of the watermark depend on the file
name. 

# Usage

`$ python pdfwatermark.py [OPTIONS] INPUT_FILENAME OUTPUT_FILENAME`

Use `--help` to see the detailed list of options

## Example

**Example 1, "trivial"**

`python pdfwatermark.py -w "WATERMARK" input.pdf output.pdf`

Puts a large black text 'WATERMARK' somewhere on all pages of `input.pdf`

**Example 2, "simple"**

`python pdfwatermark.py -w "WATERMARK" -c "#FF0000" -o 0.3 -x 200 -y 150 -a 30  input.pdf output.pdf` 

Puts a large transparent rotated pink 'WATERMARK' at the given coordinates all pages of `input.pdf`
