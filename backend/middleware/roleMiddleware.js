export function authorize(...AllowedRoles) {
    return (req, res, next) => {
        if (!req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized',
                data: null
            });
        }

        if (!AllowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden: You dont have permission',
                data: null
            });
        }

        next();
    }
};