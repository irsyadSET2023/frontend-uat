import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateUserAccount } from "@/utils/api/UserAPI";

const useUpdateUserApi = ({
  form,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [updateUserState, setUpdateUserState] = useState("pending");
  const { toast } = useToast();

  const handleUpdateUser = async (formData) => {
    try {
      setUpdateUserState("loading");
      const res = await updateUserAccount(formData);
      setUpdateUserState("success");
      onSuccess(res?.data?.data);
      toast({
        title: "Success",
        description: "Profile successfully updated!",
        duration: 3000,
        status: "success",
      });
    } catch (error) {
      setUpdateUserState("error");
      onError(error);
      toast({
        title: "Error",
        description: "Update user unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      const updateError = error?.response?.data?.errors?.errors || [];
      updateError.map((err) => {
        form.setError(err.path, {
          message: err.msg,
        });
      });
    } finally {
      setUpdateUserState("pending");
    }
  };

  return { updateUserState, handleUpdateUser };
};

export default useUpdateUserApi;
