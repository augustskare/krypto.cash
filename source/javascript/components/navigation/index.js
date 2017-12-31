import {h} from 'preact';

import styles from './styles';

const navItems = [
  { title: 'About', href: '/about' },
  { title: 'Add transaction', href: '/transaction' },
];

if (typeof(RTCPeerConnection) === 'function') {
  navItems.splice(1, 0, { title: 'Data sync', href: '/sync' });
}

const Navigation = () => (
  <nav class={styles.base}>
    <ul class={styles.list}>
      { navItems.map(item => (
        <li class={styles.item}>
          <a class={styles.link} href={item.href}>{item.title}</a>
        </li>
      )) }
    </ul>
  </nav>
)

export default Navigation;