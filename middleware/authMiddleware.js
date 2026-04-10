// Backend/middleware/roleMiddleware.js
function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
        // Ensure req.user exists (set by authMiddleware)
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized: No user data found' });
        }

        // Check if the user's role is in the list of allowed roles
        const hasRole = allowedRoles.includes(req.user.role);
        
        if (!hasRole) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }

        next();
    };
}

module.exports = roleMiddleware;
