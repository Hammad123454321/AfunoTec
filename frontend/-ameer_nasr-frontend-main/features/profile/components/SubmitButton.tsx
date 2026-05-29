import { Button } from "@/components/ui/button";

export default function SubmitButton() {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save changes
      </Button>
    </div>
  );
}
