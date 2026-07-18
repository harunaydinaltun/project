export const Footer = ({ setLang }) => {
  return (
    <footer className="footer">
      <button onClick={() => setLang("tr")}>Türkçe</button>
      <button onClick={() => setLang("en")}>English</button>
    </footer>
  );
};

export default Footer;
