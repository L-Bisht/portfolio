import Button from "../Styled/Button";

const ContactMe = () => {
  return (
    <section className="flex flex-col items-center justify-center space-y-8 w-full">
      <h1 className="text-4xl font-bold ">Reach out to me</h1>
      <p>
        Let's connect and discuss how we can work together to create amazing web
        applications. I am always open to collaborations. Feel free to reach out
        to me through the contact form below or connect with me on social media.
      </p>
      <div className="flex flex-row space-x-4 w-1/2">
        <input
          className="w-3/4 border-2 rounded-lg border-gray-300 p-2 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          type="text"
        />
        <div className="w-1/4">
          <Button>Contact me</Button>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
