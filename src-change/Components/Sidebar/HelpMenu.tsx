import { useState } from 'react';
import PlusButton from 'Components/PlusButton';

interface AccordianStates {
  colorParser: boolean;
  copyToClipboard: boolean;
  colorNames: boolean;
  randomColors: boolean;
  colorHistory: boolean;
  offlineCapability: boolean;
  splitView: boolean;
}

type AccordianID = keyof AccordianStates;

const HelpMenu = () => {
  const [accordianStates, updateAccordianStates] = useState<AccordianStates>({
    colorParser: false,
    copyToClipboard: false,
    colorNames: false,
    randomColors: false,
    colorHistory: false,
    offlineCapability: false,
    splitView: false,
  });

  const toggleAccordianState = (accordianID: AccordianID) => {
    updateAccordianStates({
      ...accordianStates,
      [accordianID]: !accordianStates[accordianID],
    });
  };

  return (
    <section className="help-menu-content">
      <h4>Welcome to Shade Generator!</h4>
      <p>
        Shade generator is a project that started as a codepen a couple years
        ago. The idea behind it was simple, when you overlap a color with a
        transparent white or black section, you end up with a tint or shade of
        that color. As many people do in web development, I would often use this
        trick to create a contrasting color effect for button hovers or element
        borders. This got annoying because in order to make the effect work, I
        would need two elements on the screen for the overlap where I often only
        needed one. So, I decided to make a little tool to help me find the
        color codes for this resulting shade by giving me a variety of
        overlapping icons with the color I was plannibg on using as the
        background. However it was still not the most convenient because I had
        to use a chrome plugin called ColorZilla to get the actual code of the
        resulting color, however I could not think of a better way. Finally,
        after using this tool hundreds of times I finally thought, there must be
        some way to calculate this resulting color!
      </p>
      <p>
        After a quick google search, I found{' '}
        <a
          href="https://www.viget.com/articles/equating-color-and-transparency/"
          target="_blank"
          rel="noopener noreferrer"
        >
          this link
        </a>
        . I immediately realized calculating the colors I wanted was possible
        with this very simple formula...
      </p>
      <p className="italic">to be continued...</p>
      <h4>Features</h4>
      <p>
        Throughout the process of making this website, I slowly started adding
        in some cool additional features. Some served a purpose, some just for
        fun.
      </p>
      <h5
        id="colorParser"
        onClick={() => {
          toggleAccordianState('colorParser');
        }}
      >
        <PlusButton color="#bdbdbd" open={accordianStates.colorParser} />
        Color Parser
      </h5>
      <div
        className={`feature-container${
          accordianStates.colorParser ? '' : ' closed'
        }`}
      >
        <p>
          One of the first things I added was the NPM package{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.npmjs.com/package/parse-color"
          >
            parse-color
          </a>
          . It takes a string and parses it for its color values in many
          different formats. It can parse colors from hex values, rgb values,
          css named colors, and cymk formats. The result is an object that has
          the following components:
        </p>
        <ul>
          <li>rgb - an array of [ red, green, blue ]</li>
          <li>hsl - an array of [ hue, saturation, luminosity ]</li>
          <li>hsv - an array of [ hue, saturation, value ]</li>
          <li>cmyk - an array of [ cyan, magenta, yellow, blac(k) ]</li>
          <li>keyword - the name of the color, if known</li>
          <li>hex - the hex rgb string #rrggbb</li>
          <li>rgba - rgb plus an alpha value</li>
          <li>hsla - hsl plus an alpha value</li>
          <li>hsva - hsv plus an alpha value</li>
          <li>cmyka - cmyk plus an alpha value</li>
        </ul>
        <p>
          This was useful, not only to interpret input from the user but also
          for providing hex and rgb values, both of which are important to this
          app&apos;s functionality. After scrubbing the user input before
          passing it to this function, it does a great job of matching
          everything you&apos;d expect it to!
        </p>
      </div>
      <h5
        id="copyToClipboard"
        onClick={() => {
          toggleAccordianState('copyToClipboard');
        }}
      >
        <PlusButton color="#bdbdbd" open={accordianStates.copyToClipboard} />
        Copy to Clipboard
      </h5>
      <div
        className={`feature-container${
          accordianStates.copyToClipboard ? '' : ' closed'
        }`}
      >
        <p>
          The next main thing I added was the option to click to copy either the
          hex code or the rgb code to your clipboard. The first two things I
          tried were <code>document.execCommand(&quot;copy&quot;)</code> and{' '}
          <code>navigator.clipboard.write()</code>. Both of these options worked
          but I ran into issued with them working on all devices. I soon
          stumbled upon a nice small NPM package called{' '}
          <a
            href="https://www.npmjs.com/package/clipboard-polyfill"
            target="_blank"
            rel="noopener noreferrer"
          >
            clipboard-polyfill
          </a>
          . It is nice and compact and gave me a convenient way to ensure
          copying would work on all devices and browser the clipboard is
          accessible in!
        </p>
      </div>
      <h5
        id="colorNames"
        onClick={() => {
          toggleAccordianState('colorNames');
        }}
      >
        <PlusButton color="#bdbdbd" open={accordianStates.colorNames} />
        Color Names
      </h5>
      <div
        className={`feature-container${
          accordianStates.colorNames ? '' : ' closed'
        }`}
      >
        <p>
          Now that the basic features were in place, it was time to have some
          fun! I decided that the page was a little too plain so I thought I
          would add some names for the colors. The first library I added for
          this is called{' '}
          <a
            href="https://www.npmjs.com/package/color-namer"
            target="_blank"
            rel="noopener noreferrer"
          >
            color-namer
          </a>
          . It appealed to me because of the fact that it offered a combination
          of multiple lists of colors including CSS colors, X11, Pantone, and
          NTC.
        </p>
        <p>
          After running into some problems with this package (I can&apos;t quite
          remember what) I decided to keep looking around. Somehow I missed the
          amazing package{' '}
          <a
            href="https://www.npmjs.com/package/color-name-list"
            target="_blank"
            rel="noopener noreferrer"
          >
            color-name-list
          </a>
          . It contains a whopping 18,000+ (and growing) color list which
          combines over 15 different sources of color names along with thousands
          of user submission. While this list is massive, it still only contains
          0.11% of the total possible RGB combinations so in order to match all
          colors so in order to match it to an input color, I used the package{' '}
          <a
            href="https://www.npmjs.com/package/nearest-color"
            target="_blank"
            rel="noopener noreferrer"
          >
            nearest-color
          </a>
          . This matches the color the user enters with the closest color from
          the list, and due to the magnitude of color-name-list, it&apos;s
          usually pretty damn close!
        </p>
      </div>
      <h5
        id="randomColors"
        onClick={() => {
          toggleAccordianState('randomColors');
        }}
      >
        <PlusButton color="#bdbdbd" open={accordianStates.randomColors} />
        Random Colors
      </h5>
      <div
        className={`feature-container${
          accordianStates.randomColors ? '' : ' closed'
        }`}
      >
        <p>
          So now I have the main functionality I want and a little pizzazz, I
          realized I needed a faster way to test the app. So I decided the best
          way would be to add a random color generator. This may seem like it
          should have been an obvious thing to make from the start but it took
          me a while to realize it (I know, sometimes I&apos;m thick). It took
          me all of 5 minutes to add it and get it going and it made a world of
          difference. Now when I&apos;m looking for colors for a new website,
          I&apos;ll just hit random until something stands out to me. And I
          still get a kick out some of these names.
        </p>
      </div>
      <h5
        id="colorHistory"
        onClick={() => {
          toggleAccordianState('colorHistory');
        }}
      >
        <PlusButton color="#bdbdbd" open={accordianStates.colorHistory} />
        Color History
      </h5>
      <div
        className={`feature-container${
          accordianStates.colorHistory ? '' : ' closed'
        }`}
      >
        <p>
          This was a feature that I added more for the experience than an it
          actually providing much value. I had been wanting to mess around with{' '}
          <a
            href="https://firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firebase Firestore
          </a>
          , Google&apos;s real time noSQL database, for a while and this was the
          perfect excuse. I added a simple collection for storing the globally
          most recent colors that anyone has submitted, updating their timestamp
          every time it is used. I could not have been more happy with how easy
          it was to set up. It was so fast to set up in fact that I had the
          history sidebar up and running in one evening and soon after I added a
          section for the most used colors as well. If you are ever interested
          in quickly bootstrapping a project that requires storing data, I
          highly recommend giving Firebase a shot
        </p>
      </div>
      <h5
        id="offlineCapability"
        onClick={() => {
          toggleAccordianState('offlineCapability');
        }}
      >
        <PlusButton color="#bdbdbd" open={accordianStates.offlineCapability} />
        Offline Capability
      </h5>
      <div
        className={`feature-container${
          accordianStates.offlineCapability ? '' : ' closed'
        }`}
      >
        <p className="italic">work in progress...</p>
      </div>
      <h5
        id="splitView"
        onClick={() => {
          toggleAccordianState('splitView');
        }}
      >
        <PlusButton color="#bdbdbd" open={accordianStates.splitView} />
        Split Screen
      </h5>
      <div
        className={`feature-container${
          accordianStates.splitView ? '' : ' closed'
        }`}
      >
        <p className="italic">work in progress...</p>
      </div>
    </section>
  );
};

export default HelpMenu;
