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
      <main className="mt-[72px] sm:px-12 md:px-64 py-16 flex flex-col space-y-24">
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
