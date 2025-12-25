const Contact = () => {
  return (
    <main className="page">
      <h1>Contact Us</h1>
      <p>
        Have questions about our perfumes or your order? Send us a message.
      </p>
      <form
        className="contact-form"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Message sent! (demo only)");
        }}
      >
        <label>
          Name
          <input type="text" required />
        </label>
        <label>
          Email
          <input type="email" required />
        </label>
        <label>
          Message
          <textarea required />
        </label>
        <button type="submit" className="primary">Send</button>
      </form>
    </main>
  );
};

export default Contact;
