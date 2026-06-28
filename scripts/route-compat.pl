#!/usr/bin/env perl
use strict;
use warnings;

my @files = @ARGV;
my %compat = map { $_ => 1 } qw(
  addToast
  Avatar Image User
  Alert Link
  Accordion AccordionItem Switch Radio RadioGroup
  Card CardBody CardHeader CardFooter
  Modal ModalContent ModalHeader ModalBody ModalFooter
  Drawer DrawerContent DrawerHeader DrawerBody DrawerFooter
  Button Tooltip Divider
  Chip Input Textarea Checkbox Tabs Tab
  Dropdown DropdownMenu DropdownItem DropdownTrigger
  Select SelectItem
  Calendar DatePicker RangeCalendar DateRangePicker
  useDisclosure
);

for my $f (@files) {
  open(my $fh, '<', $f) or die "open $f: $!";
  local $/; my $src = <$fh>; close $fh;
  my $orig = $src;

  $src =~ s!import\s*\{\s*([^}]+?)\s*\}\s*from\s*["']\@heroui/react["'];?!
    my $names = $1;
    my @parts = map { my $s = $_; $s =~ s/^\s+|\s+$//g; $s } split(/,/, $names);
    my (@keep, @move);
    for my $p (@parts) {
      next unless length $p;
      my $bare = $p; $bare =~ s/\s+as\s+\w+$//;
      if ($compat{$bare}) { push @move, $p; } else { push @keep, $p; }
    }
    my $out = "";
    $out .= 'import { '.join(", ", @keep).' } from "@heroui/react";' if @keep;
    $out .= "\n" if @keep && @move;
    $out .= 'import { '.join(", ", @move).' } from "@/compat/heroui";' if @move;
    $out;
  !gex;

  if ($src ne $orig) {
    open(my $oh, '>', $f) or die "write $f: $!";
    print $oh $src; close $oh;
    print "updated $f\n";
  }
}
