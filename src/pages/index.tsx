import { useState } from 'react';
import Head from 'next/head'
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { useDebouncedCallback } from 'use-debounce';

import styles from '@/styles/Home.module.scss';

const MEME_BACKGROUNDS = [
  {
    id: 'meme-generator-assets/pikachu',
    title: 'Surprised Pikachu',
    width: 680,
    height: 657,
  },
  {
    id: 'meme-generator-assets/miguel',
    title: 'Miguel',
    width: 400,
    height: 400,
  },
  {
    id: 'meme-generator-assets/colby',
    title: 'Colby',
    width: 400,
    height: 400,
  },
  {
    id: 'meme-generator-assets/know',
    title: 'Knowing',
    width: 640,
    height: 360,
  },
];

export default function Home() {
  const [topText, setTopText] = useState('Top Text');
  const [bottomText, setBottomText] = useState('Bottom Text');
  const [background, setBackground] = useState(MEME_BACKGROUNDS[0].id);

  const imageKey = [topText, bottomText, background].join('-');

  const debouncedSetTopText = useDebouncedCallback((value) => setTopText(value), 250);
  const debouncedSetBottomText = useDebouncedCallback((value) => setBottomText(value), 250);

  function handleOnTopTextChange(e: any) {
    debouncedSetTopText(e.currentTarget.value || ' ');
  }

  function handleOnBottomTextChange(e: any) {
    debouncedSetBottomText(e.currentTarget.value || ' ');
  }

  function handleOnBackgroundchange(id: any) {
    setBackground(id);
  }

  function handleOnBackgroundUpload(result: any) {
    console.log(result)
    setBackground(result.info.public_id);
    console.log(result)
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>

        <h1 className={styles.title}>Meme Generator</h1>
        <p className={styles.description}>Become the next meme lord!</p>

        <div className={styles.center}>
          <div>
            <form>
              <div className={styles.text}>
                <div className={styles.formRow}>
                  <label htmlFor="top-text">Top Text</label>
                  <input id="top-text" type="text" name="top_text" onChange={handleOnTopTextChange} />
                </div>
                <div className={styles.formRow}>
                  <label htmlFor="bottom-text">Bottom Text</label>
                  <input id="bottom-text" type="text" name="bottom_text" onChange={handleOnBottomTextChange} />
                </div>
              </div>
              <div>
                <div className={styles.formRow}>
                  <label htmlFor="backgrounds">Backgrounds</label>
                  <ul id="backgrounds" className={styles.backgrounds}>
                    {MEME_BACKGROUNDS.map(({ id, title }) => {
                      return (
                        <li key={id}>
                          <button onClick={() => handleOnBackgroundchange(id)}>
                            <CldImage
                              src={id}
                              width="300"
                              height="300"
                              crop="fill"
                              alt={title}
                            />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
              <div className={styles.upload}>
                <CldUploadWidget
                  options={{ folder: "meme-generator-uploads" }}
                  onSuccess={handleOnBackgroundUpload}
                  signatureEndpoint="/api/sign-cloudinary-params"
                >
                  {({ open }) => {
                    function handleOnClick(e: any) {
                      e.preventDefault();
                      open();
                    }
                    return (
                      <button onClick={handleOnClick}>
                        Upload an Image
                      </button>
                    );
                  }}
                </CldUploadWidget>
              </div>
            </form>
          </div>
          <div className={styles.image}>
            <CldImage
              key={imageKey}
              src={background}
              width="640"
              height="640"
              crop={{
                type: 'fill',
                source: true
              }}
              overlays={[
                {
                  width: 2670 - 20,
                  crop: 'fit',
                  position: {
                    x: 0,
                    y: 50,
                    gravity: 'north',
                  },
                  text: {
                    color: 'white',
                    fontFamily: 'Source Sans Pro',
                    fontSize: 90,
                    fontWeight: 'bold',
                    text: topText.toUpperCase(),
                    // @ts-ignore
                    stroke: true,
                    border: '20px_solid_black'
                  }
                },
                {
                  width: 2670 - 20,
                  crop: 'fit',
                  position: {
                    x: 0,
                    y: 50,
                    gravity: 'south',
                  },
                  text: {
                    color: 'white',
                    fontFamily: 'Source Sans Pro',
                    fontSize: 90,
                    fontWeight: 'bold',
                    text: bottomText.toUpperCase(),
                    // @ts-ignore
                    stroke: true,
                    border: '20px_solid_black'
                  }
                }
              ]}
              alt="4 hot dogs on a plate"
            />
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <div>
          <p>
            By <a href="https://twitter.com/colbyfayock">Colby Fayock</a> with <a href="https://nextjs.org/">Next.js</a> &amp; <a href="https://cloudinary.com/">Cloudinary</a>.
          </p>
          <p>
            <a href="https://github.com/colbyfayock/meme-generator">View the source</a> or <a href="https://www.youtube.com/watch?v=-LAil8T78Ns">learn how to build this</a>!
          </p>
        </div>
      </footer>
    </>
  )
}
