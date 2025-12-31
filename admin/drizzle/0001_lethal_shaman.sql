CREATE TABLE `auditLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(255) NOT NULL,
	`entityType` varchar(100),
	`entityId` int,
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(500),
	`image` varchar(500),
	`isActive` boolean NOT NULL DEFAULT true,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `deliveryHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`riderId` int NOT NULL,
	`orderId` int NOT NULL,
	`pickupLocation` text,
	`deliveryLocation` text,
	`distance` decimal(8,2),
	`duration` int,
	`rating` int,
	`review` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deliveryHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menuItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`restaurantId` int NOT NULL,
	`categoryId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`image` varchar(500),
	`isVegetarian` boolean DEFAULT false,
	`isSpicy` boolean DEFAULT false,
	`preparationTime` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`status` enum('pending','approved','rejected') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menuItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notificationReadStatus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`notificationId` int NOT NULL,
	`userId` int NOT NULL,
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notificationReadStatus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`type` enum('broadcast','alert','system','order_update') DEFAULT 'broadcast',
	`targetAudience` enum('all_users','restaurants','riders','customers','admins') DEFAULT 'all_users',
	`status` enum('draft','scheduled','sent','failed') DEFAULT 'draft',
	`sentAt` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`menuItemId` int NOT NULL,
	`quantity` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`specialInstructions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`restaurantId` int NOT NULL,
	`riderId` int,
	`orderNumber` varchar(50) NOT NULL,
	`status` enum('pending','confirmed','preparing','ready','picked_up','in_transit','delivered','cancelled','refunded') DEFAULT 'pending',
	`totalAmount` decimal(10,2) NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	`deliveryFee` decimal(10,2) DEFAULT '0',
	`serviceCharge` decimal(10,2) DEFAULT '0',
	`discount` decimal(10,2) DEFAULT '0',
	`paymentMethod` enum('cash','card','wallet','upi') DEFAULT 'cash',
	`paymentStatus` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`deliveryAddress` text NOT NULL,
	`specialInstructions` text,
	`estimatedDeliveryTime` timestamp,
	`actualDeliveryTime` timestamp,
	`rating` int,
	`review` text,
	`cancellationReason` text,
	`refundAmount` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `platformSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`dataType` enum('string','number','boolean','json') DEFAULT 'string',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platformSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `platformSettings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`address` text NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` varchar(100),
	`zipCode` varchar(20),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`cuisineType` varchar(255),
	`description` text,
	`logo` varchar(500),
	`banner` varchar(500),
	`status` enum('pending','approved','rejected','active','inactive') DEFAULT 'pending',
	`isActive` boolean NOT NULL DEFAULT true,
	`rating` decimal(3,2) DEFAULT '0',
	`totalOrders` int DEFAULT 0,
	`commissionPercentage` decimal(5,2) DEFAULT '15',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `restaurants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `riders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`licenseNumber` varchar(100) NOT NULL,
	`vehicleType` enum('bike','scooter','car') DEFAULT 'bike',
	`vehicleNumber` varchar(100),
	`status` enum('pending','approved','rejected','active','inactive','blocked') DEFAULT 'pending',
	`isActive` boolean NOT NULL DEFAULT true,
	`rating` decimal(3,2) DEFAULT '0',
	`totalDeliveries` int DEFAULT 0,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`isOnline` boolean DEFAULT false,
	`currentOrderId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `riders_id` PRIMARY KEY(`id`),
	CONSTRAINT `riders_licenseNumber_unique` UNIQUE(`licenseNumber`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','sub_admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `userType` enum('customer','restaurant_owner','rider','admin') DEFAULT 'customer';--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);