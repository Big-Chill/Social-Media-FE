import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const MyCard = ({ imageLink, caption, onButtonClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <CardHeader floated={false} className="h-64 h-32 md:h-48">
          <img
            src={imageLink}
            alt={caption}
            className="w-full h-full object-cover"
          />
        </CardHeader>

        <CardBody className="p-4">
          <Typography variant="h5" color="blue-gray" className="text-lg font-semibold mb-2">
            {caption}
          </Typography>
          {/* Add additional information if needed */}
        </CardBody>

        {onButtonClick && (
          <CardFooter className="flex justify-center gap-7 pt-2">
            <Button
              color="lightBlue"
              buttonType="link"
              size="lg"
              rounded={false}
              block={false}
              iconOnly={false}
              ripple="light"
              onClick={onButtonClick}
            >
              View
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default MyCard;
