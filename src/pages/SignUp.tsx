import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SignUpTypeModal } from "@/components/auth/SignUpTypeModal";
import CompanyAuth from "@/components/auth/CompanyAuth";
import UserAuth from "@/components/auth/UserAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- State for selecting account type ---
  const [modalOpen, setModalOpen] = useState(true);
  const [selectedType, setSelectedType] = useState<"user" | "company" | null>(
    null
  );

  if (!selectedType) {
    return (
      <SignUpTypeModal
        open={modalOpen}
        onSelect={(type) => {
          setSelectedType(type);
          setModalOpen(false);
        }}
      />
    );
  }

  // User Account Sign-Up Form (existing)
  if (selectedType === "user") {
    return <UserAuth />;
  }

  // Company Account Sign-Up Form
  if (selectedType === "company") {
    return <CompanyAuth />;
  }

  return null;
};

export default SignUp;
