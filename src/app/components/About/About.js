import styles from './About.module.css';

function About() {
    return (
        <>
            <section className={styles.block}>
                <div className={styles.about}>
                    <div className={styles.left}>
                        <h1 className={styles.title}>
                            About
                        </h1>
                        <p className={styles.text}>
                            I Know A Place is a project started by TEDxCMU Innovation back in 2022. This year, we revisited it with the same mission in mind: to tell stories worth sharing. 
                        </p>
                        <h2 className={styles.title}>
                            Innovation
                        </h2>
                        <p className={styles.text}>
                            The TEDxCMU Innovation team creates interactive experiences for the TEDxCMU board and its events. We spearhead challenging and creative projects, using technology to deliver impactful solutions. Past projects include our TEDxCMU mobile app, virtual platforms for our main events, and an LED matrix. We also curate local innovators for the annual TEDxCMU Innovation Expo in the Spring to accompany our main event. Feel free to check out some of our past projects on <a href='https://github.com/TEDxCMU'>our Github</a>.
                        </p>
                    </div>
                    <div className={styles.img}> 
                        <img width="100%" src="/inno_team.jpg"/>
                    </div>
                </div>

            </section>
        </>
    )
}

export default About;
