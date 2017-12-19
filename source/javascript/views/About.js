import {h} from 'preact';
import DonationButton from '../components/DonationButton';

const About = () => (
  <div class="content">
    <p>Krypto.cash is a free tool that helps you figure out how your cryptocurrency investments are actually doing. Made by <a class="link" rel="noopener" href="https://augustskare.no">August Skare</a> and <a class="link" rel="noopener" href="http://www.kristianhjelle.com">Kristian Hjelle</a>.</p>
    <p>The data you enter in Krypto.cash is only stored on your device.</p>
    <p>We've open sourced the code for this project on <a class="link" rel="noopener" href="https://github.com/augustskare/krypto.cash">GitHub</a>.</p>
    <p>Enjoy using this service? Buy us a coffee!</p>
    <DonationButton amount={200} />
  </div>
)

export default About;