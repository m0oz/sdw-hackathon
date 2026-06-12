import { useState } from "react";
import { api } from "../api.js";
import Fragebogen from "./Fragebogen.jsx";

export default function Quiz({ onFertig }) {
  const [laedt, setLaedt] = useState(false);

  const abschicken = async (antworten) => {
    setLaedt(true);
    try {
      onFertig(await api.matching(antworten));
    } finally {
      setLaedt(false);
    }
  };

  return (
    <Fragebogen
      onFertig={abschicken}
      laedt={laedt}
      submitLabel="Meine 4 Vorschläge zeigen"
    />
  );
}
