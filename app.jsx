import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
const room = new WebsimSocket();
const game = new window.SuperpowerGame(room);
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [superpowerInput, setSuperpowerInput] = useState("");
  const [isCreatingAvatar, setIsCreatingAvatar] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const { data: userData } = useQuery(
    currentUser ? room.collection("users").filter({ id: currentUser.id }) : null
  );
  const { data: userDatapoints } = useQuery(
    currentUser ? room.collection("user_datapoints").filter({ id: currentUser.id }) : null
  );
  const { data: allDatapoints } = useQuery(room.collection("datapoints"));
  const { data: generationQueue } = useQuery(room.collection("generation_queue"));
  useEffect(() => {
    async function init() {
      const user = await window.websim.getCurrentUser();
      setCurrentUser(user);
      await game.initialize();
    }
    init();
  }, []);
  useEffect(() => {
    if (userData && userData.length === 0 && currentUser && !showInput) {
      setShowInput(true);
    }
  }, [userData, currentUser]);
  useEffect(() => {
    if (userDatapoints && allDatapoints) {
      userDatapoints.forEach((ud) => {
        const datapoint = allDatapoints.find((dp) => dp.id === ud.datapoint_id);
        if (datapoint && window.visualEffects) {
          const position = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          };
          window.visualEffects.addDatapointEffect(datapoint, position);
        }
      });
    }
  }, [userDatapoints, allDatapoints]);
  const handleCreateAvatar = async () => {
    if (!superpowerInput.trim()) return;
    setIsCreatingAvatar(true);
    try {
      await game.createUserAvatar(superpowerInput);
      setShowInput(false);
      setSuperpowerInput("");
    } catch (error) {
      console.error("Failed to create avatar:", error);
    } finally {
      setIsCreatingAvatar(false);
    }
  };
  const userProfile = userData?.[0];
  const pendingGeneration = generationQueue?.find(
    (q) => q.target_user_id === currentUser?.id && q.status === "pending"
  );
  const getUserDatapointsWithDetails = () => {
    if (!userDatapoints || !allDatapoints) return [];
    return userDatapoints.map((ud) => {
      const datapoint = allDatapoints.find((dp) => dp.id === ud.datapoint_id);
      return { ...ud, datapoint };
    }).filter((ud) => ud.datapoint);
  };
  const evolutionLevel = userProfile ? game.calculateEvolutionLevel(getUserDatapointsWithDetails()) : 1;
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen p-8 relative", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "cosmic-bg" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 91,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxDEV("header", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent", children: "What's Your Super Power?" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 95,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xl text-gray-300", children: "Evolve through cosmic datapoints and unlock your true potential" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 98,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 94,
        columnNumber: 17
      }, this),
      showInput && /* @__PURE__ */ jsxDEV("div", { className: "generation-queue max-w-md mx-auto mb-8", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold mb-4", children: "Define Your Essence" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 105,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              value: superpowerInput,
              onChange: (e) => setSuperpowerInput(e.target.value),
              placeholder: "What do you want to become? (e.g., Master of Time, Guardian of Nature)",
              className: "w-full p-4 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none",
              onKeyPress: (e) => e.key === "Enter" && handleCreateAvatar()
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 107,
              columnNumber: 29
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleCreateAvatar,
              disabled: isCreatingAvatar || !superpowerInput.trim(),
              className: "neon-button w-full disabled:opacity-50",
              children: isCreatingAvatar ? "Manifesting Your Power..." : "Begin Evolution"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 115,
              columnNumber: 29
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 106,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 104,
        columnNumber: 21
      }, this),
      userProfile && /* @__PURE__ */ jsxDEV("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "generation-queue text-center", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "relative inline-block mb-6", children: [
            /* @__PURE__ */ jsxDEV(
              "img",
              {
                src: userProfile.base_image_url,
                alt: "Your Avatar",
                className: `superpower-avatar w-48 h-48 mx-auto ${getUserDatapointsWithDetails().length > 0 ? "evolved" : ""}`
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 131,
                columnNumber: 33
              },
              this
            ),
            getUserDatapointsWithDetails().map((ud, index) => /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: `datapoint-particle w-4 h-4 rarity-${ud.datapoint.rarity}`,
                style: {
                  top: `${20 + index * 15 % 60}%`,
                  left: `${10 + index * 20 % 80}%`,
                  backgroundColor: ud.datapoint.rarity === "legendary" ? "#ffd700" : ud.datapoint.rarity === "epic" ? "#ff006e" : ud.datapoint.rarity === "rare" ? "#00d4ff" : "#ffffff",
                  animationDelay: `${index * 0.5}s`
                }
              },
              ud.id,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 141,
                columnNumber: 37
              },
              this
            ))
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 130,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "text-3xl font-bold mb-2", children: userProfile.superpower_description }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 156,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-gray-300 mb-4", children: [
            "Evolution Level ",
            evolutionLevel
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 157,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "evolution-meter mb-6", children: /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "evolution-progress",
              style: { width: `${Math.min(evolutionLevel * 20 % 100, 100)}%` }
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 160,
              columnNumber: 33
            },
            this
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 159,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-black/30 p-3 rounded-lg", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "text-2xl font-bold text-purple-400", children: getUserDatapointsWithDetails().length }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 168,
                columnNumber: 37
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-gray-400", children: "Active Datapoints" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 171,
                columnNumber: 37
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 167,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-black/30 p-3 rounded-lg", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "text-2xl font-bold text-yellow-400", children: allDatapoints?.length || 0 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 174,
                columnNumber: 37
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-gray-400", children: "Total Discovered" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 177,
                columnNumber: 37
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 173,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 166,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 129,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "generation-queue", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold mb-4", children: "Your Cosmic Datapoints" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 184,
            columnNumber: 29
          }, this),
          getUserDatapointsWithDetails().length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "text-gray-400 text-center py-8", children: "Your first datapoint is manifesting..." }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 187,
            columnNumber: 33
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: getUserDatapointsWithDetails().map((ud) => /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: `bg-black/40 p-4 rounded-lg border-l-4 border-${ud.datapoint.rarity === "legendary" ? "yellow" : ud.datapoint.rarity === "epic" ? "pink" : ud.datapoint.rarity === "rare" ? "blue" : "gray"}-500`,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start mb-2", children: [
                  /* @__PURE__ */ jsxDEV("h4", { className: `font-bold capitalize rarity-${ud.datapoint.rarity}`, children: ud.datapoint.type.replace(/_/g, " ") }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 202,
                    columnNumber: 49
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-sm text-gray-400", children: ud.datapoint.rarity }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 205,
                    columnNumber: 49
                  }, this)
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 201,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-300 mb-2", children: ud.datapoint.metadata?.description || "A mysterious cosmic force" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 209,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between text-xs text-gray-400", children: [
                  /* @__PURE__ */ jsxDEV("span", { children: [
                    "Power: ",
                    ud.datapoint.value
                  ] }, void 0, true, {
                    fileName: "<stdin>",
                    lineNumber: 213,
                    columnNumber: 49
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: [
                    "Intensity: ",
                    (ud.visual_intensity * 100).toFixed(0),
                    "%"
                  ] }, void 0, true, {
                    fileName: "<stdin>",
                    lineNumber: 214,
                    columnNumber: 49
                  }, this)
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 212,
                  columnNumber: 45
                }, this)
              ]
            },
            ud.id,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 193,
              columnNumber: 41
            },
            this
          )) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 191,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 183,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 127,
        columnNumber: 21
      }, this),
      generationQueue && generationQueue.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "generation-queue mt-8", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-bold mb-4", children: "Cosmic Forces at Work" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 227,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: generationQueue.slice(0, 5).map((item) => /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center p-2 bg-black/30 rounded", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "capitalize", children: item.generation_type.replace(/_/g, " ") }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 231,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: `text-sm px-2 py-1 rounded ${item.status === "completed" ? "bg-green-600" : item.status === "processing" ? "bg-yellow-600" : "bg-gray-600"}`, children: item.status }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 232,
            columnNumber: 37
          }, this)
        ] }, item.id, true, {
          fileName: "<stdin>",
          lineNumber: 230,
          columnNumber: 33
        }, this)) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 228,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 226,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 93,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 90,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 249,
  columnNumber: 13
}));
