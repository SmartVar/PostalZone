"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
// import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { createTicket, editTicket } from "@/lib/actions/ticket.action";
import { CreateTicketSchema } from "@/lib/validations";

// import TagCard from "../cards/TagCard";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
// import TagCard from "../cards/TagCard";

// const Editor = dynamic(() => import("@/components/editor"), {
//   ssr: false,
// });

interface Params {
  ticket?: Ticket;
  isEdit?: boolean;
}

const TicketForm = ({ ticket, isEdit = false }: Params) => {
  const router = useRouter();
  //   const editorRef = useRef<MDXEditorMethods>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateTicketSchema>>({
    resolver: zodResolver(CreateTicketSchema),
    defaultValues: {
      division: ticket?.division || "",
      po: ticket?.po || "",
      tkttitle: ticket?.tkttitle || "",
      tktdescription: ticket?.tktdescription || "",
      tktpriority: ticket?.tktpriority || "",
      tktstatus: ticket?.tktstatus || "",
      //   content: ticket?.content || "",
      //   tags: ticket?.tags.map((tag) => tag.name) || [],
    },
  });

  // const handleInputKeyDown = (
  //   e: React.KeyboardEvent<HTMLInputElement>,
  //   field: { value: string[] }
  // ) => {
  //   console.log(field, e);
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     //   const tagInput = e.currentTarget.value.trim();

  //     //   if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
  //     //     form.setValue("tags", [...field.value, tagInput]);
  //     //     e.currentTarget.value = "";
  //     //     form.clearErrors("tags");
  //     //   } else if (tagInput.length > 15) {
  //     //     form.setError("tags", {
  //     //       type: "manual",
  //     //       message: "Tag should be less than 15 characters",
  //     //     });
  //     //   } else if (field.value.includes(tagInput)) {
  //     //     form.setError("tags", {
  //     //       type: "manual",
  //     //       message: "Tag already exists",
  //     //     });
  //     //   }
  //     // }
  //   }

  //   const handleTagRemove = (tag: string, field: { value: string[] }) => {
  //     const newTags = field.value.filter((t) => t !== tag);

  //     form.setValue("tags", newTags);

  //     if (newTags.length === 0) {
  //       form.setError("tags", {
  //         type: "manual",
  //         message: "Tags are required",
  //       });
  //     }
  //   };

  const handleCreateTicket = async (
    data: z.infer<typeof CreateTicketSchema>
  ) => {
    startTransition(async () => {
      if (isEdit && ticket) {
        const result = await editTicket({
          ticketId: ticket?._id,
          ...data,
        });

        if (result.success) {
          toast({
            title: "Success",
            description: "Ticket updated successfully",
          });

          if (result.data) router.push(ROUTES.TICKET(result.data._id));
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong",
            variant: "destructive",
          });
        }

        return;
      }

      const result = await createTicket(data);

      if (result.success) {
        toast({
          title: "Success",
          description: "Ticket created successfully",
        });

        if (result.data) router.push(ROUTES.TICKET(result.data._id));
      } else {
        toast({
          title: `Error ${result.status}`,
          description: result.error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateTicket)}
      >
        <FormField
          control={form.control}
          name="division"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Division Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Enter Division Name i.e.NMD/THN etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="po"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Post Office Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Enter Post Office Name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tkttitle"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Ticket Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Enter Ticket Title. Specify the work Civil/Electrical in title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tktdescription"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Ticket Decription <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Specifiy the detail of the issues in few words.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tktstatus"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Status <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Status will be Open/Close/Inprogress.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tktpriority"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Priority <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Priority of ticket will be Top/Medium/Low.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="primary-gradient w-fit !text-light-900"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              <>{isEdit ? "Edit" : "Creat Tickets"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TicketForm;
