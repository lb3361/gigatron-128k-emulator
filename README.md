
The contents of the `html` directory is a variant of Phil Thomas'
Javascript Gigatron emulator with support for the emulation of a 128K
RAM & IO expansion board with a SD card on port SPI0. The updated
emulator also offers a gallery of example programs and roms.

File 'http-server.py' invokes the python http server with an extension
that looks for precompressed files and serves with a Content-Encoding
header. This is useful to serve large binary files.

## Usage

There are mamy ways to execute a program on this emulator.

* Press the "Gallery" button to select one
  of the proposed ROM or a GT1 program.

* Using the default rom (`dev128k7.rom`), select the `SpiCard` program,
  and navigate a virtual SD card with a collection of GT1 files. Note
  that you must make sure that the GT1 file is compatible with the
  running ROM. 

* Use the file selection box to load any ROM file or GT1 file.
  This can also be used to load a FAT32 formatted VHD file which,
  depending on the ROM, is either accessible by selecting the `SpiCard`
  program offered on the main menu, or by long-pressing the `Start` button
  to reset the Gigatron and booting a `System.gt1` file
  located on the virtusl SD card.
  
* You can also load ROM files, GT1 files, and VHD files, by dragging
  and dropping them on the emulator window

There is also a volume slider, a mute button, and a button to
mount or umount the currently loaded VHD file.


## License

The original program is under Phil's license in file LICENSE.
The modifications are contributed under the same license.




