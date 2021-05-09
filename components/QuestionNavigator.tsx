import {
  Box,
  Button,
  Text,
  Grid,
  useColorModeValue as mode,
  Badge,
  Flex,
  Divider,
} from "@chakra-ui/react";
import * as React from "react";
import NextLink from "next/link";
import { useNavigationStore } from "providers/RootStoreProvider";
import { observer } from "mobx-react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { NavigationStore, Paths } from "@/stores/NavigationStore";

function QuestionNavigator(props: { id: string }) {
  const store = useNavigationStore();

  return (
    <>
      <Box
        bg="gray.50"
        shadow="inner"
        h="full"
        borderRight="1px"
        borderColor="gray.200"
      >
        <Box height={{ xl: "65%", "2xl": "40%" }} px="3" py="4">
          <QuestionGrid store={store} id={props.id} />
        </Box>
      </Box>
    </>
  );
}

type QuestionGridProps = { store: NavigationStore; id: string };

const QuestionGrid = observer((props: QuestionGridProps) => {
  const { store, id } = props;
  return (
    <Grid templateColumns="repeat(1, minmax(0, 1fr))" gap={2}>
      {store.paths.map((path) => {
        const number = path.params.question.number;
        const isVisited = store.VISITED_INDEX.includes(path.params.question.id);
        const isActive = path.params.question.id === id;
        const isAnswered = store.isAnswered(path.params.question.id);

        const route = {
          pathname: "/[package]/[section]/[question]",
          query: {
            package: path.params.package,
            section: path.params.section,
            question: path.params.question.id,
          },
        };

        if (isActive) {
          return (
            <ActiveButton
              key={path.params.question.id}
              path={path}
              route={route}
            />
          );
        } else if (isVisited && !isAnswered) {
          return (
            <VisitedButton
              key={path.params.question.id}
              path={path}
              route={route}
            />
          );
        } else if (isVisited && isAnswered) {
          return (
            <AnsweredButton
              key={path.params.question.id}
              path={path}
              route={route}
            />
          );
        } else {
          return (
            <UnvisitedButton
              key={path.params.question.id}
              path={path}
              route={route}
            />
          );
        }
      })}
    </Grid>
  );
});

type GridButtonProps = {
  path: Paths;
  route: {
    pathname: string;
    query: {
      package: string;
      section: string;
      question: string;
    };
  };
};

const ActiveButton = observer((props: GridButtonProps) => {
  return (
    <NextLink href={props.route}>
      <Button
        size="sm"
        _hover={{
          bgColor: mode("blue.600", "blue.300"),
        }}
        _active={{
          bgColor: mode("blue.300", "blue.300"),
        }}
        bgColor={mode("blue.500", "blue.600")}
        color={mode("blue.50", "blue.200")}
      >
        {props.path.params.question.number}
      </Button>
    </NextLink>
  );
});

const UnvisitedButton = observer((props: GridButtonProps) => {
  return (
    <NextLink href={props.route}>
      <Button
        size="sm"
        opacity={mode("100%", "50%")}
        borderColor={mode("gray.300", "gray.600")}
        variant="outline"
        color={mode("gray.500", "gray.400")}
      >
        {props.path.params.question.number}
      </Button>
    </NextLink>
  );
});

const VisitedButton = observer((props: GridButtonProps) => {
  return (
    <NextLink href={props.route}>
      <Button
        size="sm"
        opacity={mode("100%", "50%")}
        variant="outline"
        borderColor={mode("amber.300", "amber.600")}
        color={mode("amber.600", "amber.300")}
        bgColor={mode("amber.50", "amber.900")}
        _hover={{ bgColor: mode("amber.100", "amber.700") }}
        _active={{ bgColor: mode("amber.100", "amber.700") }}
      >
        {props.path.params.question.number}
      </Button>
    </NextLink>
  );
});

const AnsweredButton = observer((props: GridButtonProps) => {
  return (
    <NextLink href={props.route}>
      <Button
        size="sm"
        opacity={mode("100%", "50%")}
        borderColor={mode("emerald.400", "emerald.700")}
        bgColor={mode("emerald.50", "emerald.900")}
        color={mode("emerald.600", "emerald.100")}
        _hover={{ bgColor: mode("emerald.100", "green.700") }}
        _active={{ bgColor: mode("emerald.50", "green.700") }}
        variant="outline"
      >
        {props.path.params.question.number}
      </Button>
    </NextLink>
  );
});

export default observer(QuestionNavigator);
