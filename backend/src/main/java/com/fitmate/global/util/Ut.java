package com.fitmate.global.util;

public class Ut {

    public static class cmd {

        public static void run(String command) {
            try {
                boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
                ProcessBuilder pb = isWindows
                        ? new ProcessBuilder("cmd", "/c", command)
                        : new ProcessBuilder("bash", "-c", command);
                pb.inheritIO();
                pb.start().waitFor();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        public static void runAsync(String command) {
            new Thread(() -> run(command)).start();
        }
    }
}
