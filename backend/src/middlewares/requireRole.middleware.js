// accepte plusieurs roles
// spread operator pour les autorisations (allowed)
export const requireRole = (...allowed) => (req, res, next) => {

    // variable role 
    // qui contient une condition : si req.user existe, alors role est égal à req.user.role
    const role = req.user?.role;
  
    // si pas de role trouvé ou ne fait pas partis des autorisations, msg d'erreur
    if (!role || !allowed.includes(role)) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied.",
        error: "Access denied."
      });
    }
  
    // si tout est ok, on passe à la suite
    next();
  };