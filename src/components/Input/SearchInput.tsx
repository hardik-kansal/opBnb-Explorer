import {
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  ResponsiveValue,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { LuArrowRight, LuSearch } from "react-icons/lu";

export const SearchInput = ({
  hasDetails,
  size,
  ...props
}: {
  size?: ResponsiveValue<InputProps["size"]>;
  hasDetails?: boolean;
} & StackProps) => {
  const router = useRouter();
  const [input, setInput] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (input) {
          if (input.length === 66) {
            router.push(`/tx/${input}`);
          } else if (input.length === 42) {
            router.push(`/address/${input}`);
          } else if (input.split("/").length === 2) {
            const [chainId, blockNumber] = input.split("/");
            if (blockNumber) {
              router.push(`/block?chainId=${chainId}&number=${blockNumber}`);
            }
          }
        }
      }}
    >
      <Stack align="center" spacing={1} textAlign="center" {...props}>
        <InputGroup
          w={["full", null, "lg"]}
          variant="filled"
          size={size as any}
        >
          <InputLeftElement>
            <Icon as={LuSearch} color={"black"} />
          </InputLeftElement>
          <Input
            placeholder="Search by block number, tx hash or address"
            _placeholder={{ color: "black" }}
            color={"black"}
            borderColor={"black"}
            _focus={{
              bg: "whiteAlpha.100",
              border: "2 solid",
              borderColor: "black",
              transition: "all 0.2s ease-in-out",
            }}
            onChange={(e) => setInput(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              icon={<Icon as={LuArrowRight}  color="black"/>}
              aria-label="Search"
              variant="ghost"
              type="submit"
            />
          </InputRightElement>
        </InputGroup>
      </Stack>
    </form>
  );
};
