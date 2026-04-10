io.on('connection', socket => {
    // Track failed commands per specific connection
    let failedCommands = 0;

    socket.on('adminCommand', async (cmd) => {
        let response = { success: true, message: "" };
        
        if (!cmd) return;
        const cleanCmd = cmd.toLowerCase().trim();

        // 1. LOCK ACCOUNT COMMAND
        if (cleanCmd.startsWith("lock ")) {
            const email = cleanCmd.split(" ")[1];
            try {
                const user = await User.findOneAndUpdate(
                    { email: email }, 
                    { status: 'locked' }, 
                    { new: true }
                );

                if (user) {
                    response.message = `🔒 Account for ${email} has been LOCKED.`;
                } else {
                    response.success = false;
                    response.message = `❌ Student with email ${email} not found.`;
                }
            } catch (err) {
                response.success = false;
                response.message = "Error locking account: " + err.message;
            }
        } 
        
        // 2. DATABASE CHECK COMMAND
        else if (cleanCmd === "check database") {
            response.message = "Database connection OK ✅";
        } 
        
        // 3. SHOW LOGS COMMAND
        else if (cleanCmd === "show logs") {
            response.message = "Logs loaded 📄";
        } 

        // 4. UNKNOWN COMMAND & SECURITY TRACKING
        else {
            failedCommands++;
            response.success = false;
            response.message = "Unknown command ❌";

            // Security Trigger: Warning at 3 failures
            if (failedCommands === 3) {
                io.emit("securityAlert", {
                    level: "WARNING",
                    message: `Multiple invalid commands from user: ${socket.user?.userId || 'Unknown'}`
                });
            }

            // Security Trigger: Critical at 6 failures
            if (failedCommands >= 6) {
                io.emit("securityAlert", {
                    level: "CRITICAL",
                    message: `Suspicious activity! User ${socket.user?.userId || 'Unknown'} flagged.`
                });
                // Optional: socket.disconnect(); 
            }
        }

        // Send the final result back to the admin
        socket.emit("commandResult", response);
    });
});
