import { FaGithub } from 'react-icons/fa';
import KofiButton from 'components/kofi-button';

const SidebarFooter = () => (
  <div className="footer-row">
    <a
      href="https://github.com/csandman/shade-generator"
      rel="noopener noreferrer"
      target="_blank"
      aria-label="Link to github repository"
    >
      <FaGithub className="icon" />
    </a>
    <a
      href="https://ko-fi.com/D1D513LDD"
      rel="noopener noreferrer"
      target="_blank"
      aria-label="Support me on Ko-fi"
    >
      <KofiButton className="icon" height={42} />
    </a>
  </div>
);

export default SidebarFooter;
