import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { PasswordField } from "./PasswordField";

export const LoginForm = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // your login logic here
      }}
    >
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
        <PasswordField />
        <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
          Sign in
        </Button>
      </Stack>
    </form>
  );
};
