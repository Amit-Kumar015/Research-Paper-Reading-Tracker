import { useState } from "react";
import {
  researchDomains,
  readingStages,
  impactScores,
} from "../data/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPaper } from "@/services/paperApi";
import { toast } from "sonner";

function AddPaper() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paperTitle: "",
    firstAuthorName: "",
    researchDomain: "",
    readingStage: "",
    citationCount: "",
    impactScore: "",
    dateAdded: "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.researchDomain || formData.researchDomain === "" ||
      !formData.readingStage || formData.readingStage === "" ||
      !formData.impactScore || formData.impactScore === ""
    ) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if(Number(formData.citationCount) < 0){
      toast.error("Citation count cannot be negative");
      setLoading(false);
      return;
    }

    try {
      await createPaper({
        ...formData,
        citationCount: Number(formData.citationCount),
      });
      toast.success("Paper added successfully");

      setFormData({
        paperTitle: "",
        firstAuthorName: "",
        researchDomain: "",
        readingStage: "",
        citationCount: "",
        impactScore: "",
        dateAdded: "",
      });
    } catch (error) {
      const msg = error?.response?.data?.message || "An error occurred";
      console.error(msg);
      toast.error("Failed to add paper");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="max-w-3xl w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-medium">
            Add Research Paper
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="text-base space-y-6">
            <div className="space-y-2">
              <label className="font-medium">Paper Title</label>
              <span className="text-red-500">*</span>
              <Input
                required
                placeholder="Enter paper title"
                value={formData.paperTitle}
                onChange={(e) => handleChange("paperTitle", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">First Author Name</label>
              <span className="text-red-500">*</span>
              <Input
                required
                placeholder="Enter author name"
                value={formData.firstAuthorName}
                onChange={(e) =>
                  handleChange("firstAuthorName", e.target.value)
                }
              />
            </div>

            <div className="flex justify-between gap-4 w-full">
              <div className="space-y-2 w-full flex-1">
                <label className="font-medium">Research Domain</label>
                <span className="text-red-500">*</span>
                <Select
                  required
                  value={formData.researchDomain}
                  onValueChange={(value) =>
                    handleChange("researchDomain", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {researchDomains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full flex-1">
                <label className="font-medium">Reading Stage</label>
                <span className="text-red-500">*</span>
                <Select
                  required
                  value={formData.readingStage}
                  onValueChange={(value) => handleChange("readingStage", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {readingStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <div className="space-y-2 w-full flex-1">
                <label className="font-medium">Citation Count</label>
                <span className="text-red-500">*</span>
                <Input
                  required
                  type="number"
                  min="0"
                  placeholder="Enter citations"
                  value={formData.citationCount}
                  onChange={(e) =>
                    handleChange("citationCount", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2 w-full flex-1">
                <label className="font-medium">Impact Score</label>
                <span className="text-red-500">*</span>
                <Select
                  required
                  value={formData.impactScore}
                  onValueChange={(value) => handleChange("impactScore", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    {impactScores.map((impact) => (
                      <SelectItem key={impact} value={impact}>
                        {impact.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full flex-1">
                <label className="font-medium">Date Added</label>
                <span className="text-red-500">*</span>
                <Input
                  required
                  type="date"
                  className="w-full"
                  value={formData.dateAdded}
                  onChange={(e) => handleChange("dateAdded", e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
            >
              {loading ? "Adding Paper..." : "Add Paper"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddPaper;
