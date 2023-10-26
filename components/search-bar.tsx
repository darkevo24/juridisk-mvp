import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const SearchBar = ({ onSubmit, isLoading }) => {
  const form = useForm({
    defaultValues: { prompt: "" },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
      >
        <Input
          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent col-span-12 lg:col-span-10"
          {...form.register("prompt")}
          disabled={isLoading}
          placeholder="Skriv søkeord, setninger eller last opp dokument(er) her..."
        />
        <Button
          className="col-span-1 lg:col-span-2 w-full"
          type="submit"
          disabled={isLoading}
          size="icon"
        >
          Søk
        </Button>
      </form>
    </Form>
  );
};

export default SearchBar;
