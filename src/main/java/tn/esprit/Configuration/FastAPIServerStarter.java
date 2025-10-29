/*package tn.esprit.Configuration;

import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;

import javax.annotation.PreDestroy;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class FastAPIServerStarter implements CommandLineRunner {

    private final List<Process> pythonProcesses = new ArrayList<>();

    @Override
    public void run(String... args) throws Exception {
        startPythonServer("uvicorn llm1:app --host 0.0.0.0 --port 8001");
        startPythonServer("uvicorn app:app --host 0.0.0.0 --port 8000");
    }

    private void startPythonServer(String command) {
        try {
            ProcessBuilder builder = new ProcessBuilder();
            String os = System.getProperty("os.name").toLowerCase();
            if(os.contains("win")) {
                builder.command("cmd.exe", "/c", command);
            } else {
                builder.command("bash", "-c", command);
            }

            builder.inheritIO(); // output Python logs in Java console
            Process process = builder.start();
            pythonProcesses.add(process); // track process to kill later

            // Run in background so it doesn't block Java app
            new Thread(() -> {
                try {
                    process.waitFor();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();

            System.out.println("Started Python server: " + command);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Called automatically when Spring context is closing
    @PreDestroy
    public void stopPythonServers() {
        System.out.println("Shutting down Python servers...");
        for(Process p : pythonProcesses) {
            if(p.isAlive()) {
                p.destroy(); // send SIGTERM
                System.out.println("Stopped process: " + p.info().commandLine().orElse("Unknown"));
            }
        }
    }
}
*/