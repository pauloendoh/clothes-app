import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "native-base";
import { TagGetDto } from "../../../types/domain/tag/TagGetDto";
import { TagSaveDto } from "../../../types/domain/tag/TagSaveDto";
import pushOrReplace from "../../../utils/array/pushOrReplace";
import myAxios from "../../../utils/myAxios";
import { urls } from "../../../utils/urls";

const useSaveTagMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation(
    (payload: TagSaveDto) =>
      myAxios.post<TagGetDto>(urls.api.tags, payload).then((res) => res.data),
    {
      onSuccess: (resData) => {
        toast.show({
          description: "Tag saved!",
          duration: 2000,
        });

        queryClient.setQueryData<TagGetDto[]>([urls.api.tags], (currTags) => {
          if (!currTags) return [];

          return pushOrReplace(currTags, resData, "id");
        });
      },
      onError: (err: Error) => {
        toast.show({
          description: err.message,
        });
      },
    }
  );
};

export default useSaveTagMutation;
