import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";

import { Button } from "@chakra-ui/button";
import Editor from "@monaco-editor/react";
import { useState } from "react";

export function EditPage() {
  const [baseline, setBaseline] = useState<unknown>({});
  const [comparison, setComparison] = useState<unknown>({});
  const [baselineString, setBaselineString] = useState("{}");
  const [comparisonString, setComparisonString] = useState("{}");
  const [isEditDrawerOpen, setIsEditorDrawerOpen] = useState(false);
  const toast = useToast();

  return (
    <>
      <Button onClick={() => setIsEditorDrawerOpen(true)}>Edit</Button>

      <Drawer
        isOpen={isEditDrawerOpen}
        placement="right"
        size="xl"
        onClose={() => setIsEditorDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Source Data</DrawerHeader>

          <DrawerBody>
            <Tabs>
              <TabList>
                <Tab>Baseline</Tab>
                <Tab>Comparison</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Editor
                    height="90vh"
                    defaultLanguage="json"
                    value={baselineString}
                    onChange={(value) => setBaselineString(value ?? "")}
                    theme="light"
                  />
                </TabPanel>
                <TabPanel>
                  <Editor
                    height="90vh"
                    defaultLanguage="json"
                    value={comparisonString}
                    onChange={(value) => setComparisonString(value ?? "")}
                    theme="light"
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => setIsEditorDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                let hasError = false;
                try {
                  setBaseline(JSON.parse(baselineString));
                } catch (e) {
                  hasError = true;
                  toast({
                    title: "Invalid baseline, check your syntax and try again.",
                    status: "error",
                    isClosable: true,
                  });
                }
                try {
                  setComparison(JSON.parse(comparisonString));
                } catch (e) {
                  hasError = true;
                  toast({
                    title:
                      "Invalid comparison, check your syntax and try again.",
                    status: "error",
                    isClosable: true,
                  });
                }
                if (!hasError) {
                  setIsEditorDrawerOpen(false);
                }
              }}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
