import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "native-base";
import { ClothingDto } from "../../../types/domain/clothing/ClothingDto";
import { pushOrRemove } from "../../../utils/array/pushOrRemove";
import myAxios from "../../../utils/myAxios";
import { urls } from "../../../utils/urls";

const useDeleteClothingMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation(
    (payload: ClothingDto) =>
      myAxios.delete(urls.api.clothingsId(payload.id)).then((res) => res.data),
    {
      onSuccess: (resData, payload) => {
        toast.show({
          description: "Clothing deleted!",
        });

        queryClient.setQueryData<ClothingDto[]>(
          [urls.api.clothings],
          (currClothings) => {
            if (!currClothings) return [];

            return pushOrRemove(currClothings, payload, "id");
          }
        );
      },
      onError: (err: Error) => {
        toast.show({
          description: err.message,
        });
      },
    }
  );
};

export default useDeleteClothingMutation;
