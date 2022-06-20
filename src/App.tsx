import { ChakraProvider } from "@chakra-ui/react";
import { EditPage } from "./pages/EditPage";
import React from "react";

function App() {
  return (
    <ChakraProvider>
      <EditPage />
    </ChakraProvider>
  );
}

export default App;
