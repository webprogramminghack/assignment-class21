// Archive code useCreateTodo.ts







// onMutate: async ({ payload, queryKey }) => {
//   await queryClient.cancelQueries({ queryKey });
//   const tempId = `temp-${Date.now()}`;
//   const optimisticTodo = {
//     ...payload,
//     id: tempId,
//   };

//   const previousData = queryClient.getQueryData<InfiniteData<TodosResponse>>(queryKey);

//   if (previousData) {
//     const updatedData = {
//       ...previousData,
//       pages: previousData.pages.map((page, index) => {
//         if (index === 0) {
//           return {
//             ...page,
//             todos: [optimisticTodo, ...page.todos]
//           };
//         }
//         return page;
//       })
//     };

//     queryClient.setQueryData(queryKey, updatedData);
//   }

//   return { previousData };
// },
// onError: (_error, variables, context) => {
//   if (context?.previousData) {
//     queryClient.setQueryData(variables.queryKey, context.previousData);
//   }
  
// },
// onSettled: async (_data, _error, variables) => {
//   await queryClient.invalidateQueries({ queryKey: variables.queryKey });
// }
