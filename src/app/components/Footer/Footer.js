import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.container}>
            <p className={styles.text}>
                Made by&nbsp;
                <a className={styles.link} href="https://www.tedxcmu.org/" target="_blank" rel="noreferrer noopener">
                    TEDxCMU
                </a>
            </p>
            <p className={styles.text}>
                    Admin
            </p>
        </footer>
    )
}

export default Footer;
