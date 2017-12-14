var file = IO.getFile("Desktop", "myinfo.txt");
var stream = IO.newOutputStream(file, "text");
stream.writeString("This is some text");
stream.close();
