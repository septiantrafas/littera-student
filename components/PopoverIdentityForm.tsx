import {
  Button,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverFooter,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  InputLeftElement,
  InputGroup,
  FormErrorMessage,
} from "@chakra-ui/react";
import React from "react";
import { Auth } from "@supabase/ui";
import { Formik, Form, Field } from "formik";
import { HiIdentification } from "react-icons/hi";
import { supabase } from "utils/initSupabase";

type IPopoverFormProps = {
  onChange: (event) => void;
};

const PopoverIdentityForm: React.FC<IPopoverFormProps> = (props) => {
  const initPopoverRef = React.useRef();
  const { user, session } = Auth.useUser();

  const handleChange = (value) => {
    props.onChange(value);
  };

  return (
    <>
      <Popover
        placement="right"
        closeOnBlur={false}
        initialFocusRef={initPopoverRef}
      >
        {({ isOpen, onClose }) => (
          <>
            <Formik
              initialValues={{ nik: "" }}
              onSubmit={async (values, actions) => {
                try {
                  let { body } = await supabase
                    .from("profiles")
                    .update({ identity: values.nik })
                    .eq("id", user.id);

                  //   console.log(body);
                  handleChange(values.nik);
                  onClose();
                  return body;
                } catch (error) {
                  console.error(error);
                }
                actions.setSubmitting(false);
              }}
            >
              {(props) => (
                <>
                  <PopoverTrigger>
                    <Button variant="ghost" colorScheme="blue" size="sm">
                      Isi identitas
                    </Button>
                  </PopoverTrigger>
                  <Portal>
                    <Form>
                      <PopoverContent
                        borderRadius="lg"
                        shadow="lg"
                        sx={{
                          "&:focus:not([data-focus-visible-added])": {
                            shadow: "lg",
                          },
                        }}
                      >
                        <PopoverArrow />
                        <PopoverBody m="2">
                          <Field
                            name="nik"
                            // validate={validateName}
                          >
                            {({ field, form }) => (
                              <FormControl
                                id="nomor-induk-kependudukan"
                                isInvalid={form.errors.nik && form.touched.nik}
                                isRequired
                              >
                                <FormLabel size="sm" htmlFor="nik">
                                  Nomor Induk Kependudukan (NIK)
                                </FormLabel>
                                <InputGroup>
                                  <InputLeftElement
                                    color="gray.300"
                                    pointerEvents="none"
                                  >
                                    <HiIdentification />
                                  </InputLeftElement>
                                  <Input {...field} id="nik" type="number" />
                                </InputGroup>
                                <FormErrorMessage>
                                  {form.errors.nik}
                                </FormErrorMessage>
                                <FormHelperText>
                                  Pastikan NIK sesuai dengan yang tertera pada
                                  identitas anda.
                                </FormHelperText>
                              </FormControl>
                            )}
                          </Field>
                        </PopoverBody>
                        <PopoverFooter
                          bg="gray.50"
                          borderBottomRadius="lg"
                          display="flex"
                          justifyContent="flex-end"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            mr="2"
                            onClick={onClose}
                          >
                            Batal
                          </Button>
                          <Button
                            type="submit"
                            //   isLoading={isSubmitting}
                            isLoading={props.isSubmitting}
                            colorScheme="blue"
                            size="sm"
                          >
                            Simpan
                          </Button>
                        </PopoverFooter>
                      </PopoverContent>
                    </Form>
                  </Portal>
                </>
              )}
            </Formik>
          </>
        )}
      </Popover>
    </>
  );
};

export default PopoverIdentityForm;
