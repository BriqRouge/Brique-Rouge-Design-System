// Résout les media queries nommées (@custom-media) générées par
// @brique-rouge/tokens (build/css/custom-media.css) : @custom-media n'est pas
// encore supporté nativement par les navigateurs. Chargé automatiquement par
// Vite pour tous les CSS, y compris les CSS Modules de @brique-rouge/react.
import postcssCustomMedia from 'postcss-custom-media';

export default {
  plugins: [postcssCustomMedia()],
};
