import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";

export const QuestionNavigator = () => {
  return (
    <Stack spacing="6">
      <FormControl id="email">
        <FormLabel>Email address</FormLabel>
        <Input
          bg={mode("white", "gray.600")}
          shadow="sm"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </FormControl>
      <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
        Sign in
      </Button>
    </Stack>
  );
};
