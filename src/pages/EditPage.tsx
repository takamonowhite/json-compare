import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableCaption,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";

import { Button } from "@chakra-ui/button";
import Editor from "@monaco-editor/react";
import { useState } from "react";

function getKeysForObject(obj: any, prefix = "") {
  let keys: any[] = [];
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      keys.push(prefix + key);
    } else if (typeof obj[key] === "object") {
      keys = [...keys, ...getKeysForObject(obj[key], `${prefix}${key}.`)];
    }
  }
  return keys;
}

function getValueByKey(obj: any, key: string) {
  const subKeys = key.split(".");
  let value = obj;
  try {
    for (const subKey of subKeys) {
      value = value[subKey];
    }
  } catch (e) {
    return "";
  }
  return value;
}

function setValueByKey(obj: any, key: string, value: string) {
  const subKeys = key.split(".");
  const lastKey = subKeys.pop()!;
  let lastObj = obj;
  for (const subKey of subKeys) {
    if (!lastObj[subKey]) {
      lastObj[subKey] = {};
    }
    lastObj = lastObj[subKey];
  }
  lastObj[lastKey] = value;
  return { ...obj };
}

export function EditPage() {
  const [baseline, setBaseline] = useState<any>({});
  const [comparison, setComparison] = useState<any>({});
  const [baselineString, setBaselineString] = useState("{}");
  const [comparisonString, setComparisonString] = useState("{}");
  const [isEditDrawerOpen, setIsEditorDrawerOpen] = useState(false);
  const toast = useToast();

  const baselineKeys = getKeysForObject(baseline);

  return (
    <Box px={4} py={4}>
      <Stack pb={4}>
        <Button
          onClick={() => {
            setIsEditorDrawerOpen(true);
            setBaselineString(JSON.stringify(baseline, null, 2));
            setComparisonString(JSON.stringify(comparison, null, 2));
          }}
        >
          View Source
        </Button>
      </Stack>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Key</Th>
              <Th>Baseline</Th>
              <Th>Comparison</Th>
            </Tr>
          </Thead>
          <Tbody>
            {baselineKeys.map((key) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Input
                    placeholder="Baseline value"
                    value={getValueByKey(baseline, key)}
                    onChange={(event) => {
                      setBaseline(
                        setValueByKey(baseline, key, event.target.value)
                      );
                    }}
                  />
                </Td>
                <Td>
                  <Input
                    borderColor={
                      getValueByKey(comparison, key) ? "gray.100" : "red.300"
                    }
                    placeholder="Comparison value"
                    value={getValueByKey(comparison, key)}
                    onChange={(event) => {
                      setComparison(
                        setValueByKey(comparison, key, event.target.value)
                      );
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
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
                    height="85vh"
                    defaultLanguage="json"
                    value={baselineString}
                    onChange={(value) => setBaselineString(value ?? "")}
                    theme="light"
                  />
                </TabPanel>
                <TabPanel>
                  <Editor
                    height="85vh"
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
    </Box>
  );
}
