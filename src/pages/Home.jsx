import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
import { ClimbingBoxLoader, ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
const API_KEY = import.meta.env.VITE_API_KEY;

const Home = () => {
  // framework types
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Extract code
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  // API key
  const ai = new GoogleGenAI({
    apiKey: API_KEY,
  });

  // Generate code
  async function getResponse() {
    if (!prompt.trim())
      return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
     You are an experienced programmer with expertise in web development and UI/UX design.
     Now generate a UI component for: ${prompt}
     Framework to use: ${frameWork.value}
     Return ONLY the code inside a single HTML file.
     Use Markdown fenced code blocks.
      `,
      });

      setCode(extractCode(response.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  }

  // Copy code
  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Download code
  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "GenUI-Code.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />

      {/* Better Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-10 lg:px-16 mt-5">
        {/* Left part */}
        <div className="overflow-hidden w-full h-[80vh] py-6 rounded-xl bg-[#141319] p-5 flex flex-col">
          <h3 className="text-[23px] md:text-[26px] font-semibold sp-text">
            AI Component Generator
          </h3>
          <p className="text-gray-400 mt-2 text-[15px] md:text-[16px]">
            Describe prompt and let AI code it for you.
          </p>

          <p className="text-[15px] font-[700] mt-4">Framework</p>

          <Select
            className="mt-2"
            options={options}
            value={frameWork}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: "#333",
                color: "#fff",
                boxShadow: "none",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#111",
                color: "#fff",
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#aaa" }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#333"
                  : state.isFocused
                  ? "#222"
                  : "#111",
                color: "#fff",
              }),
            }}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className="text-[15px] font-[700] mt-5">Describe your component</p>

          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className="w-full min-h-[180px] md:min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Describe your component in detail..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
            <p className="text-gray-400 text-sm">
              Click generate button to get your code
            </p>

            <button
              onClick={getResponse}
              className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95"
            >
              {loading ? <ClipLoader color="white" size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* Right part */}
        <div className="relative w-full h-[80vh] bg-[#141319] rounded-xl overflow-hidden">
          {!outputScreen ? (
            <div className="w-full h-full flex items-center flex-col justify-center px-3 text-center">
              <div className="p-5 w-[70px] h-[70px] flex items-center justify-center text-[30px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
                <HiOutlineCode />
              </div>
              <p className="text-[15px] md:text-[16px] text-gray-400 mt-3">
                Your component & code will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-[#17171C] w-full h-[50px] flex items-center gap-3 px-3">
                <button
                  onClick={() => setTab(1)}
                  className={`w-1/2 py-2 rounded-lg ${
                    tab === 1 ? "bg-purple-600" : "bg-zinc-800"
                  } text-white`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`w-1/2 py-2 rounded-lg ${
                    tab === 2 ? "bg-purple-600" : "bg-zinc-800"
                  } text-white`}
                >
                  Preview
                </button>
              </div>

              <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-4">
                <p className="font-bold text-gray-200 text-sm md:text-base">
                  Code Editor
                </p>
                <div className="flex items-center gap-2">
                  {tab === 1 ? (
                    <>
                      <button
                        onClick={copyCode}
                        className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center"
                      >
                        <IoCopy />
                      </button>
                      <button
                        onClick={downnloadFile}
                        className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center"
                      >
                        <PiExportBold />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsNewTabOpen(true)}
                        className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center"
                      >
                        <ImNewTab />
                      </button>
                      <button
                        onClick={() => setRefreshKey((prev) => prev + 1)}
                        className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center"
                      >
                        <FiRefreshCcw />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="h-[calc(100%-100px)]">
                {tab === 1 ? (
                  <Editor
                    value={code}
                    height="100%"
                    theme="vs-dark"
                    language="html"
                  />
                ) : (
                  <iframe
                    key={refreshKey}
                    srcDoc={code}
                    className="w-full h-full bg-white text-black"
                  ></iframe>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Preview Overlay */}
      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
            <p className="font-bold">Preview</p>
            <button
              onClick={() => setIsNewTabOpen(false)}
              className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center"
            >
              <IoCloseSharp />
            </button>
          </div>
          <iframe
            srcDoc={code}
            className="w-full h-[calc(100vh-60px)]"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default Home;
