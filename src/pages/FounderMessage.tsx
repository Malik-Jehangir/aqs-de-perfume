import { useMemo } from "react";

const CEO_IMG =
  "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Fceo.jpg?alt=media&token=ec49dd0f-9007-4e76-ab43-564c75831763";

const FounderMessage = () => {
  const paragraphs = useMemo(
    () => [
      "To you,",
      "Perfume has always been personal to me. Not because of how it smells. But because of how it makes me feel. A single scent can change your entire mood. It can take you back to a moment you thought you'd forgotten. It can make you feel unstoppable on a day when everything feels heavy.",
      "That's what perfume means to me. A feeling. A memory. A reflection of who you are in that moment.",
      "I never wanted to smell like everyone else. When I walked into a room, I wanted my fragrance to be mine. Not the viral one. Not the clone. Not what was trending. Something that felt like me. But everywhere I looked, I saw the same thing. Mass production. Copy-paste formulas. Brands selling hype, not quality.",
      "That frustration planted a seed.",
      "Before AQS, I sold luxury cars. Then I moved to real estate. I met people who understood true luxury – not the kind you show off, but the kind you feel. The kind that's in the details. That kind takes time. That's when I knew what I had to build.",
      "But building it cost me. I sacrificed time with my kids and family. My newborn at that time, now I have two – and there were days I wasn't there like I should have been. I stepped back from my real estate business. I put cricket on hold – a sport I love, a national team I represent.",
      "I gave up a lot. Because I believed in this.",
      "The journey wasn't glamorous. There were sleepless nights in the car, driving from one city to another, one country to another – chasing ingredients that most people have never heard of. There were months spent on single formulas. Batches that came out wrong. Money lost. Starting from scratch.",
      "There were moments when I questioned everything.",
      "But I had people who believed in me. Friends who stood next to me when nothing was working. A family who let me chase this dream even when it didn't make sense.",
      "AQS isn't just my brand. It's our story. Built on friendship, belief, and the refusal to give up.",
      'Every bottle we create is matured for 2 years. Because I don\'t believe in shortcuts. I don\'t believe in "good enough." I believe that if you\'re going to make something, make it right. Make it rare. Make it worthy of the person who wears it.',
      "You're not buying perfume from us. You're buying a piece of a journey. Every struggle. Every sacrifice. Every late night. It's all in there.",
      "When you wear Aqs, I want you to feel what I feel. The belief that nothing can stop you. The focus that comes when you know exactly who you are. The quiet confidence that doesn't need to be loud.",
      "Not someone else's scent. Your reflection.",
      "This is just the beginning. One day, Aqs will be more than perfume. It'll be a world of handcrafted luxury – clothing, leather, timepieces – all made with the same love and obsession.",
      "But right now, it starts with you. Holding this bottle. Wearing this scent. Becoming part of our story.",
      "Thank you for believing in us. Now go find your reflection.",
    ],
    []
  );

  return (
    <main className="founder-page">
      <section className="founder-hero">
        <div className="founder-hero-inner">
          <div className="founder-hero-text">
            <p className="founder-kicker">AQS DE PARFUM</p>
            <h1 className="founder-title">A Message from Our Founder</h1>
            <p className="founder-subtitle">
              Crafted with patience. Built on belief. Made for individuals.
            </p>

            <div className="founder-meta">
              <div className="founder-name">Mohammad Sameer Fayyaz</div>
              <div className="founder-role">CEO, AQS DE PARFUM</div>
            </div>
          </div>

          <figure className="founder-portrait">
            <img
              src={CEO_IMG}
              alt="Mohammad Sameer Fayyaz"
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section className="founder-letter-wrap">
        <article className="founder-letter">
          <div className="letter-top">
            <div className="letter-mark" aria-hidden="true" />
            <p className="letter-date">— AQS DE PARFUM</p>
          </div>

          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "letter-salutation" : "letter-p"}>
              {p}
            </p>
          ))}

          <div className="letter-signoff">
            <p className="letter-p">
              With respect,
              <br />
              <br />
              <strong>Mohammad Sameer Fayyaz</strong>
              <br />
              Founder, AQS DE PARFUM
            </p>
          </div>
        </article>
      </section>
    </main>
  );
};

export default FounderMessage;
