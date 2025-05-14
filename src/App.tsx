import About from "./components/About";
import ContactMe from "./components/ContactMe";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MyProjects from "./components/MyProjects";
import Skills from "./components/Skills";

function App() {
  return (
    <>
      <Header />
      <main className="mt-[72px] px-24 md:px-36 lg:px-48 py-16 flex flex-col gap-y-8 md:gap-y-24">
        <About />
        <Skills />
        <MyProjects />
        <ContactMe />
      </main>
      <Footer />
    </>
  );
}

export default App;
